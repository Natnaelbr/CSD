// Handle File Upload
const uploadForm = document.getElementById('uploadForm');
const uploadStatus = document.getElementById('uploadStatus');

uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData();
  const fileInput = document.getElementById('fileInput');

  if (fileInput.files.length === 0) {
    uploadStatus.textContent = "Please select a file to upload.";
    return;
  }

  formData.append("file", fileInput.files[0]);

  try {
    const response = await fetch('http://localhost:3000/api/files/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      uploadStatus.textContent = "File uploaded successfully!";
    } else {
      const result = await response.text();
      uploadStatus.textContent = `Error: ${result}`;
    }
  } catch (error) {
    uploadStatus.textContent = `Error: ${error.message}`;
  }
});

// Handle File Download
const downloadForm = document.getElementById('downloadForm');

downloadForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const fileId = document.getElementById('fileId').value;

  try {
    const response = await fetch(`http://localhost:3000/api/files/download/${fileId}`);

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
});
