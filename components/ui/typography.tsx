import NLink from 'next/link';
import { twMerge } from 'tailwind-merge';

export function Heading1({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      {...props}
      className={twMerge(`
        mb-6 mt-16 scroll-m-20 text-4xl font-extrabold tracking-tight
        lg:text-5xl
      `, className)}
    />
  );
}

export function Heading2({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      {...props}
      className={twMerge(`
        mt-6 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight
        first:mt-0
      `, className)}
    />
  );
}

export function Heading3({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      {...props}
      className={twMerge(`
        mt-4 scroll-m-20 text-2xl font-semibold tracking-tight
      `, className)}
    />
  );
}

export function Heading4({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      {...props}
      className={twMerge('mt-2 scroll-m-20 text-xl font-semibold tracking-tight', className)}
    />
  );
}

export function Paragraph({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      {...props}
      className={twMerge(`
        leading-7
        not-first:mt-4
      `, className)}
    />
  );
}

export function BlockQuote({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      {...props}
      className={twMerge('mt-6 border-l-2 pl-6 italic text-muted-foreground', className)}
    />
  );
}

export function Code({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      {...props}
      className={twMerge(`
        relative select-text rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono
        text-sm font-semibold
      `, className)}
    />
  );
}

export function UnorderedList({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      {...props}
      className={twMerge(`
        my-6 ml-6 list-disc
        [&>li]:mt-2
      `, className)}
    />
  );
}

export function OrderedList({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ol
      {...props}
      className={twMerge(`
        ml-6
        [&:not(.contains-task-list)]:list-decimal
        [&>li]:mt-2
        group-[>]/md:my-6
      `, className)}
    />
  );
}

export function Link({ className, ...props }: React.ComponentProps<typeof NLink>) {
  return (
    <NLink
      {...props}
      className={twMerge(`font-medium text-primary underline underline-offset-4`, className)}
    />
  );
}
