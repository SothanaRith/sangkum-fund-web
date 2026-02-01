import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CreateRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/events/create');
  }, [router]);

  return null;
}
