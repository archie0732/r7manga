type AdminLikeUser = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

type AdminEnv = Partial<Record<'AUTH_ADMIN_USERNAME' | 'AUTH_ADMIN_PASSWORD' | 'AUTH_ADMIN_EMAIL', string>>;

export const getAdminIdentity = (env: AdminEnv) => ({
  username: env.AUTH_ADMIN_USERNAME ?? 'yuda',
  password: env.AUTH_ADMIN_PASSWORD ?? 'yudaHGOD',
  email: env.AUTH_ADMIN_EMAIL ?? 'admin@local',
});

export const isAdminUser = (user: AdminLikeUser | null | undefined) =>
  user?.role === 'admin';

export const canManageNhentaiFavorites = (user: AdminLikeUser | null | undefined) =>
  isAdminUser(user);

export const asAdminUser = (user: unknown) => user as AdminLikeUser | null | undefined;
