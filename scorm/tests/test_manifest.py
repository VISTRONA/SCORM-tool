from pathlib import Path
from xml.etree import ElementTree as ET

from scorm.manifest.generate_manifest import generate_manifest


def test_generate_manifest(tmp_path: Path):
    output = tmp_path / "imsmanifest.xml"

    result = generate_manifest(
        course_id="green-practices",
        course_title="Sustainable Workplace Green Practices",
        output_path=output,
    )

    assert result.exists()

    tree = ET.parse(result)
    root = tree.getroot()

    assert root.tag.endswith("manifest")
    assert root.attrib["identifier"] == "MANIFEST-green-practices"

    xml_text = result.read_text(encoding="utf-8")

    assert "ADL SCORM" in xml_text
    assert "1.2" in xml_text
    assert "Sustainable Workplace Green Practices" in xml_text
    assert "index.html" in xml_text
    assert "scormtype" in xml_text