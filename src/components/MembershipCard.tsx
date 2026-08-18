import { forwardRef } from "react";
import logo from "@/assets/dnp-logo.png";

export type Member = {
  name: string;
  city: string;
  reason: string;
  id: string;
  issued: string;
};

const MembershipCard = forwardRef<HTMLDivElement, { member: Member }>(({ member }, ref) => {
  return (
    <div
      ref={ref}
      className="w-full max-w-[420px] bg-card brut relative overflow-hidden"
    >
      <div className="tricolor-rule h-2 w-full" />
      <div className="flex items-start gap-4 p-5">
        <img
          src={logo}
          alt="Dimagi Naxal Party emblem"
          width={96}
          height={96}
          loading="lazy"
          className="h-20 w-20 shrink-0"
        />
        <div className="min-w-0">
          <p className="stamp text-[10px] text-muted-foreground">Dimagi Naxal Party</p>
          <h3 className="text-2xl leading-none">Membership Card</h3>
          <p className="stamp mt-1 text-[10px] text-accent">Think | Research | Resist</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t-2 border-primary px-5 py-4">
        <div className="col-span-2">
          <p className="stamp text-[9px] text-muted-foreground">Name</p>
          <p className="display text-xl">{member.name}</p>
        </div>
        <div>
          <p className="stamp text-[9px] text-muted-foreground">City</p>
          <p className="font-semibold">{member.city || "—"}</p>
        </div>
        <div>
          <p className="stamp text-[9px] text-muted-foreground">Issued</p>
          <p className="font-semibold">{member.issued}</p>
        </div>
        <div className="col-span-2">
          <p className="stamp text-[9px] text-muted-foreground">Why I think</p>
          <p className="text-sm italic">{member.reason || "Because propaganda is boring."}</p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t-2 border-primary bg-primary px-5 py-3 text-primary-foreground">
        <span className="stamp text-[10px]">Member No.</span>
        <span className="stamp text-sm font-semibold">{member.id}</span>
      </div>
      <p className="stamp px-5 py-2 text-[9px] text-muted-foreground">
        Free. Lifelong. Revocable only by you. No fees, no selfies with the leader.
      </p>
    </div>
  );
});

MembershipCard.displayName = "MembershipCard";

export default MembershipCard;
