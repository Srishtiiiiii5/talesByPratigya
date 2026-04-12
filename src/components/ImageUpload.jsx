import { Upload, message } from 'antd';
import { HiUpload } from 'react-icons/hi';
import api from '../services/api';

export default function ImageUpload({ value, onChange, className }) {

  const customRequest = async ({ file, onSuccess, onError }) => {
    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      message.error('Image must be under 5MB');
      onError(new Error('File too large'));
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const url = res.data?.data?.url || res.data?.url;
      if (url) {
        onChange(url);
        onSuccess("ok");
        message.success('Image uploaded successfully.');
      } else {
        throw new Error('No URL returned');
      }
    } catch (error) {
      console.error('Upload error', error);
      onError(error);
      message.error('Failed to upload image. Trying fallback...');
      
      // Fallback preview
      const localUrl = URL.createObjectURL(file);
      onChange(localUrl);
      onSuccess("fallback");
    }
  };

  return (
    <div className={className}>
      <Upload
        name="image"
        showUploadList={false}
        customRequest={customRequest}
        className="block w-full"
      >
        {value ? (
          <div className="relative group overflow-hidden rounded-xl border border-cream-200 dark:border-ink-600">
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-40 object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm">Change Image</span>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-cream-300 dark:border-ink-500 rounded-xl p-5 text-center min-h-[160px] flex flex-col items-center justify-center hover:bg-cream-50 dark:hover:bg-ink-700/50 transition-colors w-full cursor-pointer">
            <HiUpload className="w-7 h-7 text-ink-300 mx-auto mb-2" />
            <p className="text-xs text-ink-400 hindi-text">
              Upload Image
            </p>
          </div>
        )}
      </Upload>
    </div>
  );
}
