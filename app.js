const uploadForm = document.getElementById('uploadForm');
const uploadStatus = document.getElementById('uploadStatus');
const fileListContainer = document.getElementById('fileListContainer');  // Container to display file list
const viewFilesButton = document.getElementById('viewFilesButton');  // Dropdown button to view files

// Track uploaded files to prevent duplicate uploads
const uploadedFiles = new Set();
let isFileListVisible = false; // Track whether the file list is visible

// Handle File Upload
uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) {
    uploadStatus.textContent = "Please select a file to upload.";
    return;
  }

  // Check if the file has already been uploaded
  if (uploadedFiles.has(file.name)) {
    uploadStatus.textContent = "This file has already been uploaded.";
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch('http://localhost:5041/api/files/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      uploadStatus.textContent = "File uploaded successfully!";
      uploadedFiles.add(file.name);  // Add the file name to the Set
    } else {
      const result = await response.text();
      uploadStatus.textContent = `Error: ${result}`;
    }
  } catch (error) {
    uploadStatus.textContent = `Error: ${error.message}`;
  }
});

// Handle File Download
async function downloadFile(fileId) {
  try {
    const response = await fetch(`http://localhost:5041/api/files/download/${fileId}`);

    if (response.ok) {
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;

      const contentDisposition = response.headers.get('Content-Disposition');
      const fileName = contentDisposition
        ? contentDisposition.split('filename=')[1].trim()
        : `file_${fileId}`;

      link.download = fileName;
      link.click();
      URL.revokeObjectURL(downloadUrl);  // Clean up the object URL
    } else {
      const result = await response.text();
      alert(`Error: ${result}`);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

// List Uploaded Files (fetch from server every time)
async function listUploadedFiles() {
  try {
    const response = await fetch('http://localhost:5041/api/files/list');

    if (response.ok) {
      const files = await response.json();
      fileListContainer.innerHTML = '';  // Clear the previous file list

      if (files.length === 0) {
        fileListContainer.textContent = "No files available.";
      } else {
        const fileList = document.createElement('ul');

        files.forEach(file => {
          const listItem = document.createElement('li');
          listItem.textContent = `${file.fileName} (Uploaded on: ${new Date(file.createdAt).toLocaleString()})`;
          listItem.dataset.fileId = file.id;

          // Add download link
          const downloadLink = document.createElement('a');
          downloadLink.href = '#';
          downloadLink.textContent = "Download";
          downloadLink.addEventListener('click', async (event) => {
            event.preventDefault();
            await downloadFile(file.id);
          });

          listItem.appendChild(downloadLink);
          fileList.appendChild(listItem);
        });

        fileListContainer.appendChild(fileList);
      }

      fileListContainer.style.display = 'block'; // Show the file list container
    } else {
      fileListContainer.textContent = "Failed to fetch file list.";
    }
  } catch (error) {
    fileListContainer.textContent = `Error: ${error.message}`;
  }
}

// Event Listener for the "View Files" Button
viewFilesButton.addEventListener('click', async () => {
  if (!isFileListVisible) {
    await listUploadedFiles();  // Fetch and display the list when the button is clicked
    fileListContainer.style.display = 'block'; // Show the file list container
  } else {
    fileListContainer.style.display = 'none'; // Hide the file list container
  }
  isFileListVisible = !isFileListVisible; // Toggle visibility status
});

// Ensure the list is hidden on page load
document.addEventListener('DOMContentLoaded', () => {
  fileListContainer.style.display = 'none';  // Hide the list initially
});
