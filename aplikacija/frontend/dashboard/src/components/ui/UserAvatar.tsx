type UserAvatarProps = {
  fullName: string;
};
const UserAvatar = ({ fullName }: UserAvatarProps) => {
  const initials = fullName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const colors = [
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-emerald-500",
    "bg-rose-500",
    "bg-amber-500",
  ];

  const hash = fullName
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const backgroundColor = colors[hash % colors.length];
  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold text-white opacity-90
        ${backgroundColor}`}
    >
      {initials}
    </div>
  );
};

export default UserAvatar;
