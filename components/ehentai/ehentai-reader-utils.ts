type AutoLoadBatchInput = {
  hasMore: boolean;
  isIntersecting: boolean;
  pending: boolean;
};

export const shouldAutoLoadEhentaiBatch = ({
  hasMore,
  isIntersecting,
  pending,
}: AutoLoadBatchInput) => hasMore && isIntersecting && !pending;
