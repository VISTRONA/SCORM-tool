"""SCORM 1.2 imsmanifest.xml generator."""
# Sab thike hai


from pathlib import Path
from xml.etree import ElementTree as ET


IMS_NS = "http://www.imsproject.org/xsd/imscp_rootv1p1p2"
ADLCP_NS = "http://www.adlnet.org/xsd/adlcp_rootv1p2"

ET.register_namespace("", IMS_NS)
ET.register_namespace("adlcp", ADLCP_NS)


def generate_manifest(
    course_id: str,
    course_title: str,
    output_path: Path,
    launch_file: str = "index.html",
) -> Path:
    """
    Generate the root imsmanifest.xml for a single-SCO SCORM 1.2 course.

    Returns the path to the generated manifest.
    """

    if not course_id.strip():
        raise ValueError("course_id cannot be empty")

    if not course_title.strip():
        raise ValueError("course_title cannot be empty")

    manifest = ET.Element(
        f"{{{IMS_NS}}}manifest",
        {
            "identifier": f"MANIFEST-{course_id}",
            "version": "1.0",
        },
    )

    metadata = ET.SubElement(manifest, f"{{{IMS_NS}}}metadata")

    schema = ET.SubElement(metadata, f"{{{IMS_NS}}}schema")
    schema.text = "ADL SCORM"

    schema_version = ET.SubElement(
        metadata,
        f"{{{IMS_NS}}}schemaversion",
    )
    schema_version.text = "1.2"

    organizations = ET.SubElement(
        manifest,
        f"{{{IMS_NS}}}organizations",
        {"default": "ORG-1"},
    )

    organization = ET.SubElement(
        organizations,
        f"{{{IMS_NS}}}organization",
        {"identifier": "ORG-1"},
    )

    title = ET.SubElement(
        organization,
        f"{{{IMS_NS}}}title",
    )
    title.text = course_title

    item = ET.SubElement(
        organization,
        f"{{{IMS_NS}}}item",
        {
            "identifier": "ITEM-1",
            "identifierref": "RESOURCE-1",
        },
    )

    item_title = ET.SubElement(
        item,
        f"{{{IMS_NS}}}title",
    )
    item_title.text = course_title

    resources = ET.SubElement(
        manifest,
        f"{{{IMS_NS}}}resources",
    )

    resource = ET.SubElement(
        resources,
        f"{{{IMS_NS}}}resource",
        {
            "identifier": "RESOURCE-1",
            "type": "webcontent",
            f"{{{ADLCP_NS}}}scormtype": "sco",
            "href": launch_file,
        },
    )

    ET.SubElement(
        resource,
        f"{{{IMS_NS}}}file",
        {"href": launch_file},
    )

    tree = ET.ElementTree(manifest)

    ET.indent(tree, space="  ")

    output_path.parent.mkdir(parents=True, exist_ok=True)

    tree.write(
        output_path,
        encoding="utf-8",
        xml_declaration=True,
    )

    return output_path