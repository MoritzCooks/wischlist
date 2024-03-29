import { withIronSessionApiRoute } from "iron-session/next"
import { DatabaseHelper } from "lib/api/DatabaseHelper"
import { authCookieInformation } from "lib/auth"
import { ClientHelper } from "lib/client/ClientHelper"
import { NextApiRequest, NextApiResponse } from "next"
import ApiResponse, { HTTPMethods } from "types/ApiResponse"
import { RawWishData, Wish } from "types/Wish"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const json: ApiResponse<RawWishData[] | RawWishData | undefined> = {
      success: true,
      result: undefined,
    }

    
    const user = req.session?.user
    if (!user || user?.id === null || user?.id === undefined) {
      res.status(405).send({ message: "Unauthorized." })
      return
    }
    
    const { listId } = req.query

    const wishDB = new DatabaseHelper<Wish>(`/lists/${listId}/wishes`)
    
    const { id, ...rest } = JSON.parse(req.body || "{}") as Wish
    res.status(200)
    switch (req.method as HTTPMethods) {
      case "GET":
        const wishRefs = await wishDB.getAll()

        json.result = wishRefs.map((ref) => ({
          id: ref.id,
          ...ref.data(),
        })) as Wish[]
        res.json(json)
        break
      case "PUT":
        await wishDB.update(id, { ...rest })
        res.json(json)
        break
      case "POST":
        const wishRef = await wishDB.add({ ...rest })
        json.result = {
          id: wishRef.id,
          ...(await wishRef.get()).data(),
        } as Wish
        res.json(json)
        break
      case "DELETE":
        await wishDB.delete(id)
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
