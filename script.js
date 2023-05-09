const qrCodeElement = document.getElementById('qrcode');
const refreshButton = document.getElementById('refresh');

// Replace this with your server's LNURL-auth endpoint  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const lnurlAuthEndpoint = 'https://yourserver.com/lnurl-auth';

async function generateQRCode() {
    try {
        const response = await axios.get(lnurlAuthEndpoint);
        const lnurl = response.data.lnurl;
        qrCodeElement.innerHTML = '';
        QRCode.toCanvas(qrCodeElement, lnurl, { width: 200 });
    } catch (error) {
        console.error('Error generating QR code:', error);
    }
}

refreshButton.addEventListener('click', generateQRCode);

// Generate a QR code when the page loads
generateQRCode();


// Add this function to your scripts.js file
async function authenticateUser(publicKey, signature, k1) {
    try {
      const response = await axios.post('/api/authenticate', { publicKey, signature, k1 });
      if (response.data.success) {
        localStorage.setItem('publicKey', publicKey);
        window.location.href = 'notes.html';
      } else {
        console.error('Authentication failed.');
      }
    } catch (error) {
      console.error('Error authenticating user:', error);
    }
  }
  
