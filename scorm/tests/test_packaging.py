import json
from pathlib import Path
from zipfile import ZipFile

import pytest

from scorm.packaging.build_package import build_scorm_package
from scorm.packaging.validate import ExportValidationError


PROJECT_ROOT = Path(__file__).resolve().parents[2]


def load_sample():
    path = PROJECT_ROOT / "shared" / "sample-course.json"

    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def create_test_inputs(tmp_path: Path, course: dict):
    player = tmp_path / "player-source"
    theme = tmp_path / "theme-source"
    assets = tmp_path / "assets-source"

    player.mkdir()
    theme.mkdir()
    assets.mkdir()

    (player / "index.html").write_text(
        "<!doctype html><title>Test Player</title>",
        encoding="utf-8",
    )

    (theme / "theme.css").write_text(
        "body {}",
        encoding="utf-8",
    )

    # Create dummy files for every referenced asset.
    for slide in course["course"]["slides"]:
        asset = slide.get("asset")

        if asset:
            relative = Path(asset["path"])
            destination = assets / Path(*relative.parts[1:])
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(b"test")

    return player, theme, assets


def test_build_scorm_package(tmp_path: Path):
    course = load_sample()

    player, theme, assets = create_test_inputs(tmp_path, course)

    output = tmp_path / "course.zip"

    build_scorm_package(
        course_document=course,
        output_zip=output,
        player_dir=player,
        theme_dir=theme,
        asset_root=assets,
    )

    assert output.exists()

    with ZipFile(output) as archive:
        files = set(archive.namelist())

    assert "imsmanifest.xml" in files
    assert "index.html" in files
    assert "course.json" in files
    assert "player/index.html" in files
    assert "theme/theme.css" in files


def test_invalid_course_is_rejected(tmp_path: Path):
    course = load_sample()
    course["course"]["title"] = ""

    player, theme, assets = create_test_inputs(tmp_path, course)

    with pytest.raises(ExportValidationError):
        build_scorm_package(
            course_document=course,
            output_zip=tmp_path / "bad.zip",
            player_dir=player,
            theme_dir=theme,
            asset_root=assets,
        )


def test_missing_asset_is_rejected(tmp_path: Path):
    course = load_sample()

    player, theme, assets = create_test_inputs(tmp_path, course)

    # Remove all generated assets.
    for file in assets.rglob("*"):
        if file.is_file():
            file.unlink()

    with pytest.raises(ExportValidationError):
        build_scorm_package(
            course_document=course,
            output_zip=tmp_path / "bad.zip",
            player_dir=player,
            theme_dir=theme,
            asset_root=assets,
        )