import React, { useState, useRef } from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Image, Upload, Trash2, AlertCircle } from "lucide-react";

interface FileUploadProps {
    className?: string;
    onChange?: (file: File | null) => void;
    onPreviewChange?: (preview: string | null) => void;
}

const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function FileUpload({
    className,
    onChange,
    onPreviewChange,
    ...props
}: FileUploadProps) {
    const [isDragActive, setIsDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): string | null => {
        if (!file) return null;

        if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
            return "File type not accepted. Please upload JPG, PNG, or WebP images only.";
        }

        if (file.size > MAX_FILE_SIZE) {
            return "File is too large. Maximum size is 1MB.";
        }

        return null;
    };

    const handlePreview = (file: File | null) => {
        if (!file) {
            setPreview(null);
            if (onPreviewChange) onPreviewChange(null);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setPreview(result);
            if (onPreviewChange) onPreviewChange(result);
        };
        reader.readAsDataURL(file);
    };

    const handleChange = (file: File | null) => {
        setError(null);

        if (!file) {
            // if (onChange) onChange(null);
            handlePreview(null);
            return;
        }

        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            if (inputRef.current) inputRef.current.value = "";
            return;
        }

        if (onChange) onChange(file);
        handlePreview(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            handleChange(file);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleChange(e.target.files[0]);
        }
    };

    const removeFile = () => {
        handleChange(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    const triggerFileInput = () => {
        if (inputRef.current) inputRef.current.click();
    };

    return (
        <div
            className={cn("space-y-4", className)}
            {...props}
        >
            {!preview ? (
                <div
                    className={cn(
                        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                        isDragActive
                            ? "border-primary bg-primary/5"
                            : error
                                ? "border-red-500 bg-red-50"
                                : "border-muted-foreground/25 hover:border-blue-500/50",
                        className
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                >
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <div className={`rounded-full ${error ? "bg-red-100" : "bg-muted"} p-3`}>
                            {error ? (
                                <AlertCircle className="h-6 w-6 text-red-500" />
                            ) : (
                                <Upload className="h-6 w-6 text-muted-foreground" />
                            )}
                        </div>
                        <div className="flex flex-col items-center">
                            {error ? (
                                <p className="text-sm font-medium text-red-500">{error}</p>
                            ) : (
                                <>
                                    <p className="text-sm font-medium">
                                        Drag & drop an image here or click to upload
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        JPG, PNG or WebP up to 1MB
                                    </p>
                                </>
                            )}
                        </div>
                        <Button
                            type="button"
                            variant={error ? "destructive" : "outline"}
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                triggerFileInput();
                            }}
                        >
                            <Image className="mr-2 h-4 w-4" /> Select Image
                        </Button>
                    </div>
                    <input
                        type="file"
                        ref={inputRef}
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="sr-only"
                    />
                </div>
            ) : (
                <div className="relative rounded-lg border overflow-hidden">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-auto object-contain max-h-[300px]"
                    />
                    <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={removeFile}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
