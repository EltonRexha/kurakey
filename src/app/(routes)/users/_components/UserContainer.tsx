'use client';
import UserCard, { UserCardData } from './UserCard';

interface UserContainerProps {
  heading: string;
  users: UserCardData[];
}

const UserContainer: React.FC<UserContainerProps> = ({ heading, users }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-neutral-100">{heading}</h2>
      {users.length ? (
        <div className="flex flex-wrap gap-4">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <p className="text-neutral-400">No users found.</p>
      )}
    </div>
  );
};

export default UserContainer;
