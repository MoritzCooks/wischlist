import { withIronSessionApiRoute } from "iron-session/next"
import { listDB } from "lib/api"
import { authCookieInformation } from "lib/auth"
import { NextApiRequest, NextApiResponse } from "next"
import ApiResponse, { HTTPMethods } from "types/ApiResponse"
import { List } from "types/List"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { listId } = req.query
    const json: ApiResponse<List[] | List | undefined> = {
      success: true,
      result: undefined,
    }
    const user = req.session?.user
    if (!user || user?.id === null || user?.id === undefined) {
      res.status(405).send({ message: "Unauthorized." })
      return
    }

    const { id, ...rest } = JSON.parse(req.body || "{}") as List
    res.status(200)
    switch (req.method as HTTPMethods) {
      case "GET":
        const listRefs = await listDB.getAll()
        json.result = listRefs.map((ref) => ({
          id: ref.id,
          ...ref.data(),
        })) as List[]
        res.json(json)
        break
      case "POST":
        const ref = await listDB.add({ ...rest })
        // TODO: List-Ref am User hinterlegen
        json.result = {
          id: ref.id,
          ...(await ref.get()).data(),
        } as List
        res.json(json)
        break
      default:
        return res.status(405).json({
          success: false,
          message: `Method ${req.method} not allowed`,
        })
    }

    return res
  } catch (e: any) {
    console.error(`Error: ${e.stack}`)
    return res.status(500).json({
      success: false,
      message: typeof e === "string" ? e : e?.message || "unknown error",
    })
  }
}

export default withIronSessionApiRoute(handler, authCookieInformation)
