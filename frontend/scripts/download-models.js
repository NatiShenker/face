// scripts/download-models.js
const https = require('https');
const fs = require('fs');
const path = require('path');

const MODELS_DIR = path.join(process.cwd(), 'public', 'models');

// Ensure models directory exists
if (!fs.existsSync(MODELS_DIR)) {
  fs.mkdirSync(MODELS_DIR, { recursive: true });
}

const MODELS = [
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json',
    filename: 'tiny_face_detector_model-weights_manifest.json'
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1',
    filename: 'tiny_face_detector_model-shard1'
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json',
    filename: 'face_landmark_68_model-weights_manifest.json'
  },
  {
    url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1',
    filename: 'face_landmark_68_model-shard1'
  }
];

async function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(MODELS_DIR, filename);
    const file = fs.createWriteStream(filepath);
    
    console.log(`Downloading ${filename}...`);
    
    https.get(url, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close(() => {
          console.log(`✓ Downloaded ${filename}`);
          resolve();
        });
      });

      file.on('error', err => {
        fs.unlink(filepath, () => reject(err));
      });
    }).on('error', err => {
      fs.unlink(filepath, () => reject(err));
    });
  });
}

async function downloadModels() {
  console.log('Starting download of face-api.js models...\n');
  
  try {
    for (const model of MODELS) {
      try {
        await downloadFile(model.url, model.filename);
      } catch (error) {
        console.error(`\nError downloading ${model.filename}:`, error.message);
        throw error;
      }
    }
    console.log('\nAll models downloaded successfully! 🎉');
  } catch (error) {
    console.error('\nFailed to download all models');
    process.exit(1);
  }
}

// Execute
downloadModels();