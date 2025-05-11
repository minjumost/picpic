export interface User {
  memberId: number;
  nickname: string;
  color: string;
  profileImageUrl: string;
}

export type StompMessage = {
  type: "session_enter";
  status: string;
  participants: User[];
};
