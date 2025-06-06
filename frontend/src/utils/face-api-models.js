// storeModels.js
import {db} from './indexdb';
import * as faceapi from "face-api.js";

export async function storeFaceModelsToIndexedDB() {
  const modelFiles = [
    // SSD Mobilenet
    '/models/ssd_mobilenetv1_model-shard1',
    '/models/ssd_mobilenetv1_model-shard2', // ✅ ADD THIS
    '/models/ssd_mobilenetv1_model-weights_manifest.json',

    // Face Landmark 68
    '/models/face_landmark_68_model-shard1',
    // '/models/face_landmark_68_model-shard2', // ✅ ADD THIS
    '/models/face_landmark_68_model-weights_manifest.json',

    // Face Recognition
    '/models/face_recognition_model-shard1',
    '/models/face_recognition_model-shard2', // ✅ ADD THIS
    '/models/face_recognition_model-weights_manifest.json',
  ];


  for (const url of modelFiles) {
    const res = await fetch(url);
    const blob = await res.blob();
    const name = url.split('/models/')[1];
    await db.models.put({ name, blob });
  }

  console.log('Models saved to IndexedDB');
}

 function setupFaceApiModelFetchFromIndexedDB() {
  const originalFetch = window.fetch;

  window.fetch = async function(input, init) {
    if (typeof input === 'string' && input.startsWith('/models/')) {
      const modelName = input.split('/models/')[1];
      const record = await db.models.get(modelName);
      if (record?.blob) {
        return new Response(record.blob);
      } else {
        throw new Error(`Model ${modelName} not found in IndexedDB`);
      }
    }
    return originalFetch(input, init);
  };
}

export async function loadFaceModels() {
  if (window.navigator.onLine) {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
  } else {
    setupFaceApiModelFetchFromIndexedDB();
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
  }
}


