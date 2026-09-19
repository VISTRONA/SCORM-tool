"""SCORM 1.2 package builder."""

import json
import shutil
import tempfile
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

from scorm.manifest.generate_manifest import generate_manifest
from scorm.packaging.validate import (
    validate_assets,
    validate_course,
)


def _copy_directory(source: Path, destination: Path) -> None:
    if not source.is_dir():
        raise FileNotFoundError(f"Required directory not found: {source}")

    shutil.copytree(source, destination, dirs_exist_ok=True)


def build_scorm_package(
    course_document: dict,
    output_zip: Path,
    player_dir: Path,
    theme_dir: Path,
    asset_root: Path,
) -> Path:
    """
    Build a self-contained SCORM 1.2 ZIP.

    `player_dir` and `theme_dir` are external inputs so the packager does not
    depend on their implementations.
    """

    validate_course(course_document)
    validate_assets(course_document, asset_root)

    course = course_document["course"]

    with tempfile.TemporaryDirectory(prefix="hr-scorm-") as temp:
        staging = Path(temp)

        # Shared course data
        (staging / "course.json").write_text(
            json.dumps(course_document, indent=2, ensure_ascii=False),
            encoding="utf-8",
        )

        # Player supplied by SCORM-2.
        _copy_directory(player_dir, staging / "player")

        # Selected theme.
        _copy_directory(theme_dir, staging / "theme")

        # Referenced course assets.
        destination_assets = staging / "assets"
        destination_assets.mkdir()

        for slide in course["slides"]:
            asset = slide.get("asset")

            if not asset:
                continue

            relative = Path(asset["path"])
            asset_relative = Path(*relative.parts[1:])

            source = asset_root / asset_relative
            destination = destination_assets / asset_relative

            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, destination)

        # Temporary launch bridge.
        #
        # Suhani's player remains independent. This simply launches the
        # packaged player from the SCORM root.
        (staging / "index.html").write_text(
            """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>HR SCORM Studio Course</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <iframe
    src="player/index.html"
    title="Course Player"
    style="position:fixed;inset:0;width:100%;height:100%;border:0">
  </iframe>
</body>
</html>
""",
            encoding="utf-8",
        )

        generate_manifest(
            course_id=course["id"],
            course_title=course["title"],
            output_path=staging / "imsmanifest.xml",
        )

        output_zip.parent.mkdir(parents=True, exist_ok=True)

        with ZipFile(output_zip, "w", ZIP_DEFLATED) as archive:
            for file in staging.rglob("*"):
                if file.is_file():
                    archive.write(
                        file,
                        file.relative_to(staging).as_posix(),
                    )

    return output_zip