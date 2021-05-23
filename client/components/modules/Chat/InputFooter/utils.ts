export const isLink = (string: string) => {
  return /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/.test(string);
};

export const getFileType = (mimeType: string): "file" | "image" | "video" => {
  if (mimeType.split("/")[0] === "image") return "image";
  if (mimeType.split("/")[0] === "video") return "video";
  return "file";
};
