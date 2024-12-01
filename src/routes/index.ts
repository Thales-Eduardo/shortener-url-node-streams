import { Router } from "express";

const router = Router();

// encurtar a url
router.post("/shorten_url", async (req, res) => {
  const { user_id, original_url } = req.body;
  //   const dados = await createUrlShortenController({ user_id, original_url });
  //   res.status(201).json(dados);
});

//redirect url
router.get("/:hash", async (req, res) => {
  const { hash } = req.params;
  //   const link: any = await redirectUrlController(hash);
  //   res.status(302).redirect(link);
});

router.get("/", async (req, res) => {
  res.send("Shortener URL Backend");
});

export { router };
