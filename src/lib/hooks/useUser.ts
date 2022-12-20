import { useEffect } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { AuthenticatedUser } from "types/User"

export default function useUser({
  redirectTo = "",
  redirectIfFound = false,
} = {}) {
  const router = useRouter()
  const { data: user, error, isValidating, isLoading, mutate: mutateUser } = useSWR<AuthenticatedUser>("/api/user",)
//   const result = useSWR<UserLoginState>("/api/user")

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !user) return

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user?.isLoggedIn)
    ) {
      router.push(redirectTo)
    }
  }, [user, redirectIfFound, redirectTo, router])

  return { user, mutateUser }
}
