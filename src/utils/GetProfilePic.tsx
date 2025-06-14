export function getProfilePicUrl(avatar?: string) {
  return avatar && avatar.trim() !== "" ? avatar : "/noprofilepic.png";
}
