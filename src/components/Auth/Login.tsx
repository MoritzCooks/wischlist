"use client"
import crypto from "crypto"
import { login } from "lib/client/authClient"
import useUser from "lib/hooks/useUser"
import Link from "next/link"
import React, { FormEvent } from "react"
import styles from "./Auth.module.scss"
import Loading from "components/Loading/Loading"

const Login = () => {
  const { user, mutateUser, loading, validating } = useUser({
    redirectTo: "/profile",
    redirectIfFound: true,
  })
  const emailRef = React.useRef<HTMLInputElement>(null)
  const passwordRef = React.useRef<HTMLInputElement>(null)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    const email = emailRef.current?.value
    const password = passwordRef.current?.value
    if (!email || !password) return

    const hash = crypto.createHash("md5").update(password).digest("hex")

    const result = await login({
      email: email,
      passwordHash: hash,
    })

    mutateUser(result)

    // alert(JSON.stringify(result))

    /* --- only with firebase-admin change which breaks currently ---*/
    // if ((await userDB.where("email", "==", email)).length > 0) {
    //   alert(`Email ${email} bereits registriert.`);
    //   return;
    // }

    // await userDB
    //   .add({
    //     email: emailRef.current.value,
    //     passwordHash: hash,
    //     lastLogin: new Date(),
    //   })
    // .then((result) => alert(`id ${result.id} added`));
  }

  console.log({ loading, validating, user })

  if (loading || validating || user?.isLoggedIn) return <Loading />

  return (
    <form onSubmit={handleLogin} className={styles.wrapper}>
      <label className={styles.inputlabel} htmlFor="#email">
        Email
      </label>
      <input
        id="email"
        type={"email"}
        className={styles.textfield}
        ref={emailRef}
        placeholder="Email"
      />
      <label className={styles.inputlabel} htmlFor="#password">
        Passwort
      </label>
      <input
        id="password"
        type={"password"}
        className={styles.textfield}
        ref={passwordRef}
        placeholder="Passwort"
      />
      <span className={styles.buttonWrapper}>
        <button type={"submit"}>Login</button>
        <button type={"reset"}>Zurücksetzen</button>
      </span>

      <br />
      <p className={styles.darktext}>
        Noch kein Account? <Link href={`/register`}>Hier registrieren</Link>
      </p>
    </form>
  )
}

export default Login
