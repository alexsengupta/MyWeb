import os
import PyPDF2
import pdfplumber
from crossref.restful import Works

# Directory containing the PDFs
pdf_dir = '/Users/alexsengupta/OneDrive - UNSW/MyWeb/papers'

# Output file
output_file = 'output.txt'

# Crossref API
works = Works()

# Open the output file
with open(output_file, 'w') as f:
    # Loop over all files in the directory
    for filename in os.listdir(pdf_dir):
        # Check if the file is a PDF
        if filename.endswith('.pdf'):
            # Full path to the PDF file
            pdf_path = os.path.join(pdf_dir, filename)

            # Open the PDF file
            with pdfplumber.open(pdf_path) as pdf:
                # Initialize variables
                doi = None
                abstract = None

                # Search the first few pages for the DOI
                for i in range(min(5, len(pdf.pages))):
                    # Extract the text of the page
                    page_text = pdf.pages[i].extract_text()

                    # Look for the DOI if we haven't found it yet
                    if doi is None:
                        # Assume the DOI is in the page and starts with '10.'
                        start = page_text.find('10.')
                        if start != -1:
                            # Assume the DOI ends with a space
                            end = page_text.find(' ', start)
                            if end != -1:
                                # Extract the DOI
                                doi = page_text[start:end]

                    # Stop searching if we've found the DOI
                    if doi is not None:
                        break

                # Fetch citation information using the DOI
                if doi is not None:
                    citation_info = works.doi(doi)

                    # If the abstract is not available from the Crossref API, try to extract it from the PDF
                    if 'abstract' not in citation_info:
                        # Search the first few pages for the abstract
                        for i in range(min(5, len(pdf.pages))):
                            # Extract the text of the page
                            page_text = pdf.pages[i].extract_text()

                            # Look for the abstract if we haven't found it yet
                            if abstract is None:
                                start = page_text.lower().find('abstract')
                                if start != -1:
                                    # Assume the abstract ends with 'introduction'
                                    end = page_text.lower().find('introduction', start)
                                    if end != -1:
                                        # Extract the abstract
                                        abstract = page_text[start:end]

                            # Stop searching if we've found the abstract
                            if abstract is not None:
                                break

                    # Write the citation information to the output file
                    f.write(f'--- {filename} ---\n')
                    f.write('DOI:\n')
                    f.write(doi)
                    f.write('\n')
                    f.write('Title:\n')
                    f.write(citation_info['title'][0] if 'title' in citation_info else 'N/A')
                    f.write('\n')
                    f.write('Authors:\n')
                    if 'author' in citation_info:
                        for author in citation_info['author']:
                            f.write(f"{author['given']} {author['family']}\n")
                    else:
                        f.write('N/A\n')
                    f.write('Publication Year:\n')
                    f.write(str(citation_info['created']['date-parts'][0][0]) if 'created' in citation_info else 'N/A')
                    f.write('\n')
                    f.write('Journal/Book Chapter:\n')
                    f.write(citation_info['container-title'][0] if 'container-title' in citation_info else 'N/A')
                    f.write('\n')
                    f.write('Abstract:\n')
                    if 'abstract' in citation_info:
                        f.write(citation_info['abstract'])
                    elif abstract is not None:
                        f.write(abstract)
                    else:
                        f.write('N/A')
                    f.write('\n')
    
    print(f'Output written to {output_file}')

