import { useMemberCount } from "@/hooks/use-member-count";

const MemberCounter = () => {
  const count = useMemberCount();

  if (count === null) return null;

  return (
    <p className="stamp text-[11px] text-muted-foreground">
      <span className="text-accent">{count.toLocaleString("en-IN")}</span>{" "}
      {count === 1 ? "member" : "members"} and counting
    </p>
  );
};

export default MemberCounter;
