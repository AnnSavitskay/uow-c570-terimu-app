import { useNavigate, useSearchParams } from "react-router";
import { Game1, Game2, Game3 } from "~/components/games";
import type { Route } from "./+types/$game";

export default function Page({ params }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/story";

  const game = parseInt(params.game);

  if (game === 1) {
    return (
      <div className="h-full flex flex-col">
        <Game1 redirectUrl={redirectTo} />
      </div>
    );
  } else if (game === 2) {
    return (
      <div className="h-full flex flex-col">
        <Game3 redirectUrl={redirectTo} />
      </div>
    );
  } else if (game === 3) {
    return (
      <div className="h-full flex flex-col">
        <Game2 redirectUrl={"/"} />
      </div>
    );
  } else {
    return <div className="p-4">Game not found.</div>;
  }
}
