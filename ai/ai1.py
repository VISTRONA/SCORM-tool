import pymupdf
import re
from pathlib import Path


def normalize_text(text):
    """
    Clean extracted PDF text.
    """

    
    text = re.sub(r"[ \t]+", " ", text)

    
    text = re.sub(r"\n\s*\n+", "\n\n", text)

    
    lines = [line.strip() for line in text.splitlines()]

    
    lines = [line for line in lines if line]

    return "\n".join(lines).strip()


def extract_pdf(pdf_path):
    """
    Extract text from a PDF page by page.

    Returns structured data containing:
    - document name
    - total pages
    - page number
    - extracted text
    - character count
    - extraction status
    - errors
    """

    pdf_path = Path(pdf_path)

    
    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

   
    if pdf_path.suffix.lower() != ".pdf":
        raise ValueError("Input file must be a PDF.")

    pages = []
    document_errors = []

    try:
        document = pymupdf.open(pdf_path)

        total_pages = document.page_count

        for page_index, page in enumerate(document):
            page_number = page_index + 1
            page_errors = []

            try:
               
                raw_text = page.get_text("text")

               
                cleaned_text = normalize_text(raw_text)

                
                if not cleaned_text:
                    page_errors.append(
                        "No extractable text found. "
                        "Page may be scanned or image-based."
                    )

                    status = "warning"

                elif len(cleaned_text) < 20:
                    page_errors.append(
                        "Very little text was extracted. "
                        "Page may require OCR review."
                    )

                    status = "warning"

                else:
                    status = "success"

                pages.append(
                    {
                        "page_number": page_number,
                        "text": cleaned_text,
                        "character_count": len(cleaned_text),
                        "status": status,
                        "errors": page_errors,
                    }
                )

            except Exception as error:
                pages.append(
                    {
                        "page_number": page_number,
                        "text": "",
                        "character_count": 0,
                        "status": "error",
                        "errors": [str(error)],
                    }
                )

        document.close()

    except Exception as error:
        document_errors.append(str(error))

        return {
            "document_name": pdf_path.name,
            "total_pages": 0,
            "successful_pages": 0,
            "warning_pages": 0,
            "error_pages": 0,
            "pages": [],
            "errors": document_errors,
        }

    successful_pages = sum(
        1 for page in pages if page["status"] == "success"
    )

    warning_pages = sum(
        1 for page in pages if page["status"] == "warning"
    )

    error_pages = sum(
        1 for page in pages if page["status"] == "error"
    )

    return {
        "document_name": pdf_path.name,
        "total_pages": total_pages,
        "successful_pages": successful_pages,
        "warning_pages": warning_pages,
        "error_pages": error_pages,
        "pages": pages,
        "errors": document_errors,
    }


if __name__ == "__main__":
    import sys
    import json

    if len(sys.argv) != 2:
        print("Usage: python ai/ai1.py <pdf_path>")
        sys.exit(1)

    pdf_path = sys.argv[1]

    try:
        result = extract_pdf(pdf_path)

        print(json.dumps(result, indent=2, ensure_ascii=False))

    except Exception as error:
        print(f"Error: {error}")
        sys.exit(1)