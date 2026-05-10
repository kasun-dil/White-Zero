export const getAvatarUrl = (user) => {
  if (user && user.profileImage) {
    return user.profileImage;
  }
  const name = user && user.name ? user.name : 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&bold=true&length=2&size=128`;
};
