const AUTH_STORAGE_KEY = 'delmi_lab_unlocked';
export const VALID_CODE = 'DELMI';

export function isLabUnlocked(): boolean {
  try {
    return (
      localStorage.getItem(AUTH_STORAGE_KEY) === 'true' ||
      sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true'
    );
  } catch {
    return false;
  }
}

export function verifyCode(inputCode: string): boolean {
  const normalized = (inputCode || '').trim().toUpperCase();
  if (normalized === VALID_CODE) {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
    } catch {}
    return true;
  }
  return false;
}

export function lockLabs(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {}
}

// Aliases for backwards compatibility
export const isAccessLabUnlocked = isLabUnlocked;
export const verifyBetaCode = verifyCode;
export const lockAccessLab = lockLabs;
export const VALID_BETA_CODE = VALID_CODE;
