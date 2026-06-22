import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload
import argparse
import sys
import os

def upload_basic(file_path, file_name, mime_type):
    """Insert new file.
    Returns : Id's of the file uploaded
    Load pre-authorized user credentials from the environment.
    """
    # Load credentials from the environment
    try:
        creds, _ = google.auth.default()
    except Exception as e:
        print(f"Error loading credentials: {e}")
        print("Ensure you have set the GOOGLE_APPLICATION_CREDENTIALS environment variable.")
        return None

    try:
        # Create a new Drive API client (v3)
        service = build('drive', 'v3', credentials=creds)

        # File's metadata
        file_metadata = {'name': file_name}
        
        # The media content to be uploaded
        media = MediaFileUpload(file_path, 
                                mimetype=mime_type)

        # Upload the file
        file = service.files().create(body=file_metadata,
                                    media_body=media,
                                    fields='id').execute()
        
        print(f'File ID: {file.get("id")}')
        return file.get('id')

    except HttpError as error:
        print(f'An error occurred: {error}')
        return None
    except Exception as e:
        print(f'An unexpected error occurred: {e}')
        return None

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Upload a file to Google Drive.')
    parser.add_argument('file_path', help='Path to the local file to upload')
    parser.add_argument('--name', help='Name of the file in Google Drive. Defaults to the local file name.')
    parser.add_argument('--mime_type', default='application/octet-stream', help='MIME type of the file')
    args = parser.parse_args()

    if not os.path.exists(args.file_path):
        print(f"Error: File '{args.file_path}' does not exist.")
        sys.exit(1)

    file_name = args.name if args.name else os.path.basename(args.file_path)
    
    upload_basic(args.file_path, file_name, args.mime_type)
