import { Metadata } from "next"
import NotFoundParty from "@modules/common/components/not-found-party"

export const metadata: Metadata = {
  title: "404 - Party Not Found",
  description: "Oops! Looks like the party moved.",
}

export default function NotFound() {
  return <NotFoundParty />
}
