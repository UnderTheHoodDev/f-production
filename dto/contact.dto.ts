export type ContactRequestDto = {
  name: string;
  email: string;
  service: string;
  budget?: string;
  message?: string;
};

export type ContactResponseDto = {
  success: boolean;
  message: string;
  referenceId: string;
};

