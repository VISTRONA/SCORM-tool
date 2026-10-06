"""Validation used by the SCORM export gate."""

import json
from pathlib import Path

from jsonschema import Draft202012Validator


PROJECT_ROOT = Path(__file__).resolve().parents[2]
COURSE_SCHEMA = PROJECT_ROOT / "shared" / "course-schema.json"


class ExportValidationError(Exception):
    """Raised when a course cannot safely be exported."""


def load_json(path: Path) -> dict:
    try:
        with path.open("r", encoding="utf-8") as file:
            return json.load(file)
    except FileNotFoundError as exc:
        raise ExportValidationError(f"File not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise ExportValidationError(
            f"Invalid JSON in {path}: {exc.msg}"
        ) from exc


def validate_course(course_document: dict) -> None:
    schema = load_json(COURSE_SCHEMA)

    validator = Draft202012Validator(schema)
    errors = sorted(
        validator.iter_errors(course_document),
        key=lambda error: list(error.absolute_path),
    )

    if errors:
        messages = []

        for error in errors:
            location = ".".join(str(part) for part in error.absolute_path)
            location = location or "<root>"

            messages.append(f"{location}: {error.message}")

        raise ExportValidationError(
            "Course validation failed:\n- " + "\n- ".join(messages)
        )


def validate_assets(course_document: dict, asset_root: Path) -> None:
    """
    Ensure every local asset referenced by Course JSON exists.

    Asset paths in Course JSON are expected to use the `assets/...`
    convention.
    """

    slides = course_document["course"]["slides"]

    for slide in slides:
        asset = slide.get("asset")

        if not asset:
            continue

        asset_path = asset.get("path")

        if not asset_path:
            continue

        relative = Path(asset_path)

        if relative.is_absolute() or ".." in relative.parts:
            raise ExportValidationError(
                f"Unsafe asset path on slide '{slide['id']}': {asset_path}"
            )

        if not relative.parts or relative.parts[0] != "assets":
            raise ExportValidationError(
                f"Invalid asset path on slide '{slide['id']}': "
                f"{asset_path}. Expected assets/..."
            )

        source = asset_root / Path(*relative.parts[1:])

        if not source.is_file():
            raise ExportValidationError(
                f"Missing asset for slide '{slide['id']}': {asset_path}"
            )