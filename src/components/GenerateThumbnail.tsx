"use client";

import { useState, type ChangeEvent } from "react";

export interface GenerateThumbnailProps {
  initialImage?: string | null;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const GenerateThumbnail = ({ initialImage }: GenerateThumbnailProps) => {
  const [image, setImage] = useState(initialImage ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      input.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError("Choose an image smaller than 5 MB.");
      input.value = "";
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
    if (!cloudName) {
      setError("Image uploads are not configured.");
      input.value = "";
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Image upload failed (${response.status}).`);
      }

      const result: unknown = await response.json();
      if (
        typeof result !== "object" ||
        result === null ||
        !("publicId" in result) ||
        typeof result.publicId !== "string" ||
        !result.publicId.trim()
      ) {
        throw new Error("The upload response did not contain a valid publicId.");
      }

      setImage(
        `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,g_face,w_400,h_400,f_auto,q_auto/${encodeURI(result.publicId)}`
      );
    } catch (uploadError) {
      console.error("Error uploading image:", uploadError);
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed.");
    } finally {
      setIsUploading(false);
      input.value = "";
    }
  };

  return (
    <>
      <input type="hidden" name="photoUrl" value={image} />
      <div>
        <label className="label" htmlFor="employee-photo">Profile picture</label>
        <input
          id="employee-photo"
          name="employeePhoto"
          type="file"
          accept="image/*"
          className="field"
          onChange={uploadImage}
          disabled={isUploading}
          aria-describedby={error ? "employee-photo-error" : undefined}
          aria-invalid={Boolean(error)}
        />
        {isUploading && <p className="mt-1 text-[11px] text-muted">Uploading image...</p>}
        {error && <p id="employee-photo-error" role="alert" className="mt-1 text-[11px] text-red-600">{error}</p>}
      </div>
      {image && (
        <div>
          <p className="label">Profile picture preview</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="Employee profile picture preview" className="size-20 rounded-full object-cover" />
          <button type="button" className="text-btn mt-2" onClick={() => setImage("")}>Remove picture</button>
        </div>
      )}
    </>
  );
};

export default GenerateThumbnail;
