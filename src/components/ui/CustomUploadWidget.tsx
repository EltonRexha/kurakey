import { useState, useRef, useCallback } from 'react';
import { X, Check, ArrowLeft } from 'lucide-react';
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Image from 'next/image';

interface CustomUploadWidgetProps {
  onSuccess: (imageUrl: string) => void;
  onError: (message: string) => void;
  children: (props: { open: () => void }) => React.ReactNode;
  disabled?: boolean;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const CustomUploadWidget: React.FC<CustomUploadWidgetProps> = ({
  onSuccess,
  onError,
  children,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);

  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Validate file size (2MB)
      if (file.size > MAX_FILE_SIZE) {
        onError('File size must be less than 2MB');
        handleClose();
        return;
      }
      // Validate file type
      if (!ALLOWED_FORMATS.includes(file.type)) {
        onError('Only JPG, PNG, and WebP formats are allowed');
        handleClose();
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || '');
        setIsOpen(true);
      });
      reader.readAsDataURL(file);
    } else {
      // User cancelled file selection, close the modal
      handleClose();
    }
  };

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      const crop = centerAspectCrop(width, height, 1);
      setCrop(crop);
    },
    []
  );

  const getCroppedImg = useCallback(
    (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No 2d context');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
          },
          'image/jpeg',
          0.9
        );
      });
    },
    []
  );

  const handleCropAndUpload = async () => {
    if (!imgRef.current || !completedCrop || !selectedFile) return;
    setIsUploading(true);
    try {
      const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
      const croppedFile = new File([croppedBlob], selectedFile.name, {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });
      const formData = new FormData();
      formData.append('image', croppedFile);
      const response = await fetch('/api/upload-profile-image', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
      setIsUploading(false);
      const data = await response.json();
      onSuccess(data.imageUrl);
      handleClose();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedFile(null);
    setImageSrc('');
    setCrop(undefined);
    setCompletedCrop(undefined);
    setScale(1);
  };

  const open = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const goBack = () => {
    setSelectedFile(null);
    setImageSrc('');
    setCrop(undefined);
    setCompletedCrop(undefined);
    setScale(1);

    setIsOpen(false);
  };

  return (
    <>
      {children({ open })}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={onSelectFile}
        className="hidden"
        disabled={isUploading}
      />
      {isOpen && imageSrc && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50">
          <div className="bg-[#191838] border border-[#11142d] rounded-xl p-6 w-[500px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={goBack}
                  className="text-gray-400 hover:text-white transition-colors"
                  disabled={isUploading}
                >
                  <ArrowLeft size={20} />
                </button>
                <h3 className="text-lg font-semibold text-white">Edit Image</h3>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors"
                disabled={isUploading}
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-center bg-gray-900 rounded-lg p-4 min-h-[300px]">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop
                >
                  <Image
                    ref={imgRef}
                    alt="Crop me"
                    src={imageSrc}
                    width={400}
                    height={400}
                    style={{
                      transform: `scale(${scale})`,
                      maxWidth: '100%',
                      maxHeight: '300px',
                    }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <label className="text-sm text-gray-300">Scale:</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-300 w-8">
                    {scale.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCropAndUpload}
                  disabled={isUploading || !completedCrop}
                  className="flex-1 bg-[#008cff] cursor-pointer  hover:bg-[#008cff]/80 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      Upload Image
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomUploadWidget;
