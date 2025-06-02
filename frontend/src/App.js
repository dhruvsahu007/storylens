import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [story, setStory] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setError("");
    const selected = e.target.files[0];
    if (selected && selected.type.startsWith("image/")) {
      setFile(selected);
      setStory("");
      setAudioUrl("");
    } else {
      setError("Please upload a valid image file.");
      setFile(null);
      setStory("");
      setAudioUrl("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/upload-photo", formData);
      setStory(res.data.story);
      setAudioUrl(`http://localhost:8000${res.data.audio_url}`);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    }
    setLoading(false);
  };

  const handleReset = () => {
    setFile(null);
    setStory("");
    setAudioUrl("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 transition-all duration-300 hover:shadow-indigo-200">
        <div className="space-y-4 mb-8">
          <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 select-none">
            📸 StoryLens
          </h1>
          <p className="text-center text-gray-600 text-lg">Transform your images into captivating stories with AI-powered narration</p>
        </div>

        <div className="group">
          <label
            htmlFor="file-upload"
            className="block w-full border-3 border-dashed border-indigo-300 rounded-2xl p-8 text-center cursor-pointer 
                     hover:bg-indigo-50/50 hover:border-indigo-400 transition-all duration-300 relative
                     group-hover:shadow-lg group-hover:shadow-indigo-100"
            aria-describedby="file-upload-hint"
          >
            {file ? (
              <div className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="mx-auto h-72 object-contain rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                  <p className="text-white font-medium">Click to change image</p>
                </div>
              </div>
            ) : (
              <div className="py-12 space-y-4">
                <div className="text-5xl mb-4">📂</div>
                <span className="text-indigo-600 font-semibold text-lg block">Drop your image here</span>
                <span className="text-gray-400 text-sm block">or click to browse</span>
              </div>
            )}
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-describedby="file-upload-hint"
            />
          </label>
          <p
            id="file-upload-hint"
            className="mt-3 text-center text-sm text-gray-400 select-none"
          >
            Supported formats: JPG, PNG, GIF, etc.
          </p>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-center text-red-600 font-medium select-none" role="alert">{error}</p>
          </div>
        )}

        <div className="flex gap-4 justify-center mt-8">
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3.5 rounded-xl 
                     shadow-lg shadow-indigo-200 hover:shadow-indigo-300 disabled:opacity-50 
                     disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5
                     focus:outline-none focus:ring-4 focus:ring-indigo-300 font-medium text-lg"
          >
            {loading ? (
              <span className="flex items-center gap-3 justify-center">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Creating Magic...
              </span>
            ) : (
              "Generate Story ✨"
            )}
          </button>

          <button
            onClick={handleReset}
            disabled={loading || (!file && !story && !audioUrl)}
            className="bg-gray-100 text-gray-700 px-6 py-3.5 rounded-xl shadow-md hover:bg-gray-200 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300
                     focus:outline-none focus:ring-4 focus:ring-gray-200 font-medium"
          >
            Reset
          </button>
        </div>

        {story && (
          <section className="mt-12 animate-fadeIn">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2 select-none">
              <span className="text-3xl">📝</span> Your Story
            </h2>
            <div className="bg-white p-6 rounded-xl border border-indigo-100 text-gray-700 
                          whitespace-pre-wrap shadow-lg hover:shadow-xl transition-shadow duration-300
                          leading-relaxed text-lg">
              {story}
            </div>
          </section>
        )}

        {audioUrl && (
          <section className="mt-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2 select-none">
              <span className="text-3xl">🔊</span> Listen to Your Story
            </h2>
            <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <audio 
                controls 
                src={audioUrl} 
                className="w-full focus:outline-none" 
                style={{ height: '40px' }}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
