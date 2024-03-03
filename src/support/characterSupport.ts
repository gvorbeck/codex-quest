import { images } from "../assets/images/faces/imageAssets";

export function extractImageName(url: string) {
  const regex = /\/static\/media\/(.*[^-])\..*?\.jpg/;
  const match = url.match(regex);
  return match ? match[1] : undefined;
}

export const getAvatar = (avatar: string) => {
  let image = "";
  if (avatar.startsWith("/static/media/")) {
    const legacyImage = extractImageName(avatar);
    if (legacyImage) {
      // find the matching source images in `images`
      // "/src/assets/images/faces/gnome-boy-1.jpg" matches gnome-boy-1
      image = images.find((image) => image.includes(legacyImage)) || "";
    }
  } else {
    image = avatar;
  }
  return image;
};

export const openInNewTab = (url: string) => {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};
