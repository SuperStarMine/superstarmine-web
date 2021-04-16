export function resolveSrcsets(imageDirectory, imageExtensionsShort, imageSizes, imageId) {
  return imageExtensionsShort.map(ext => {
    return imageSizes.map(size => `${imageDirectory}${imageId}@${size}w.${ext} ${size}w`);
  });
}

export function getSafeImageExtensionIndex(imageExtensionsShort) {
  return imageExtensionsShort.findIndex(i => i == "jpg" || i == "png") || 0;
}