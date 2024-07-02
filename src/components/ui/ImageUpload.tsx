"use client";
import React, { useEffect, useState } from "react";
import {CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  disabled?: boolean;
  values: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

export function ImageUpload({disabled,values,onChange,onRemove,}: ImageUploadProps) {
  
  const [mounted, setMounted] = useState(false);

  useEffect(function () {
    setMounted(true);
  }, []);

  function onUpload(result: any) {
    console.log(result);
    onChange(result.info.secure_url);
  }

  if (!mounted) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center mb-4 gap-4">
        {values?.map((url) => (
          <div
            key={url}
            className="relative h-[200px] w-[200px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => onRemove(url)}>
                <Trash className="w-4 h-4" />
              </Button>
            </div>
            <Image fill className="object-cover" src={url} alt="image" />
          </div>
        ))}
      </div>

      <CldUploadWidget
        onSuccess={onUpload}
        uploadPreset={"wsfexuqw"}>

        { ({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}>

              <ImagePlus className="w-4 h-4 mr-2" />
              Upload an image
            </Button>
          );
        }}

      </CldUploadWidget>

    </div>
  );
}
