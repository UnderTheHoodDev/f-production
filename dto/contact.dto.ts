export type ContactRequestDto = {
  fullName: string;
  phone: string;
  address?: string;
  content?: string;
};

export type ContactResponseDto = {
  success: boolean;
  message: string;
  referenceId: string;
};
