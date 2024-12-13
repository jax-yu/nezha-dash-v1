import ServerFlag from "@/components/ServerFlag";
import ServerUsageBar from "@/components/ServerUsageBar";

import {
  cn,
  formatNezhaInfo,
  getDaysBetweenDates,
  parsePublicNote,
} from "@/lib/utils";
import { NezhaServer } from "@/types/nezha-api";
import { Card } from "./ui/card";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  GetFontLogoClass,
  GetOsName,
  MageMicrosoftWindows,
} from "@/lib/logo-class";
import {formatBytes, formatSpeed} from "@/lib/format";
import { Separator } from "./ui/separator";

export default function ServerCardInline({
  now,
  serverInfo,
}: {
  now: number;
  serverInfo: NezhaServer;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    name,
    country_code,
    online,
    cpu,
    up,
    down,
    mem,
    stg,
    platform,
    uptime,
    net_in_transfer,
    net_out_transfer,
    public_note,
  } = formatNezhaInfo(now, serverInfo);

  const showFlag = true;

  const parsedData = parsePublicNote(public_note);

  let daysLeft = 0;
  let isNeverExpire = false;

  if (parsedData?.billingDataMod?.endDate) {
    if (parsedData.billingDataMod.endDate.startsWith("0000-00-00")) {
      isNeverExpire = true;
    } else {
      daysLeft = getDaysBetweenDates(
        parsedData.billingDataMod.endDate,
        new Date(now).toISOString(),
      );
    }
  }

  return online ? (
    <section>
      <Card
        className={cn(
          "flex items-center lg:flex-row justify-start gap-3 p-3 md:px-5 cursor-pointer hover:bg-accent/50 transition-colors min-w-[900px] w-full",
        )}
        onClick={() => navigate(`/server/${serverInfo.id}`)}
      >
        <section
          className={cn("grid items-center gap-2 lg:w-36")}
          style={{ gridTemplateColumns: "auto auto 1fr" }}
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-green-500 self-center"></span>
          <div
            className={cn(
              "flex items-center justify-center",
              showFlag ? "min-w-[17px]" : "min-w-0",
            )}
          >
            {showFlag ? <ServerFlag country_code={country_code} /> : null}
          </div>
          <div className="relative w-28 flex flex-col">
            <p
              className={cn(
                "break-all font-bold tracking-tight",
                showFlag ? "text-xs " : "text-sm",
              )}
            >
              {name}
            </p>
            {parsedData &&
              (daysLeft >= 0 ? (
                <p
                  className={cn("text-[10px] text-muted-foreground", {
                    "text-orange-600": daysLeft <= 7 && !isNeverExpire,
                  })}
                >
                  剩余时间: {isNeverExpire ? "永久" : daysLeft + "天"}
                </p>
              ) : (
                <p
                  className={cn(
                    "text-[10px] text-muted-foreground text-red-600",
                  )}
                >
                  已过期: {daysLeft * -1} 天
                </p>
              ))}
          </div>
        </section>
        <Separator orientation="vertical" className="h-8 mx-0 ml-2" />
        <div className="flex flex-col gap-2">
          <section className={cn("grid grid-cols-9 items-center gap-3 flex-1")}>
            <div
              className={"items-center flex flex-row gap-2 whitespace-nowrap"}
            >
              <div className="text-xs font-semibold">
                {platform.includes("Windows") ? (
                  <MageMicrosoftWindows className="size-[10px]" />
                ) : (
                  <p className={`fl-${GetFontLogoClass(platform)}`} />
                )}
              </div>
              <div className={"flex w-14 flex-col"}>
                <p className="text-xs text-muted-foreground">
                  {t("serverCard.system")}
                </p>
                <div className="flex items-center text-[10.5px] font-semibold">
                  {platform.includes("Windows")
                    ? "Windows"
                    : GetOsName(platform)}
                </div>
              </div>
            </div>
            <div className={"flex w-20 flex-col"}>
              <p className="text-xs text-muted-foreground">
                {t("serverCard.uptime")}
              </p>
              <div className="flex items-center text-xs font-semibold">
                {(uptime / 86400).toFixed(0)} {t("serverCard.days")}
              </div>
            </div>
            <div className={"flex w-14 flex-col"}>
              <p className="text-xs text-muted-foreground">{"CPU"}</p>
              <div className="flex items-center text-xs font-semibold">
                {cpu.toFixed(2)}%
              </div>
              <ServerUsageBar value={cpu} />
            </div>
            <div className={"flex w-14 flex-col"}>
              <p className="text-xs text-muted-foreground">
                {t("serverCard.mem")}
              </p>
              <div className="flex items-center text-xs font-semibold">
                {mem.toFixed(2)}%
              </div>
              <ServerUsageBar value={mem} />
            </div>
            <div className={"flex w-14 flex-col"}>
              <p className="text-xs text-muted-foreground">
                {t("serverCard.stg")}
              </p>
              <div className="flex items-center text-xs font-semibold">
                {stg.toFixed(2)}%
              </div>
              <ServerUsageBar value={stg} />
            </div>
            <div className={"flex w-16 flex-col"}>
              <p className="text-xs text-muted-foreground">
                {t("serverCard.upload")}
              </p>
              <div className="flex items-center text-xs font-semibold">
                {
                  formatSpeed(up)
                }
              </div>
            </div>
            <div className={"flex w-16 flex-col"}>
              <p className="text-xs text-muted-foreground">
                {t("serverCard.download")}
              </p>
              <div className="flex items-center text-xs font-semibold">
                {
                  formatSpeed(down)
                }
              </div>
            </div>
            <div className={"flex w-20 flex-col"}>
              <p className="text-xs text-muted-foreground">
                {t("serverCard.totalUpload")}
              </p>
              <div className="flex items-center text-xs font-semibold">
                {formatBytes(net_out_transfer)}
              </div>
            </div>
            <div className={"flex w-20 flex-col"}>
              <p className="text-xs text-muted-foreground">
                {t("serverCard.totalDownload")}
              </p>
              <div className="flex items-center text-xs font-semibold">
                {formatBytes(net_in_transfer)}
              </div>
            </div>
          </section>
        </div>
      </Card>
    </section>
  ) : (
    <Card
      className={cn(
        "flex  min-h-[61px] min-w-[900px] items-center justify-start gap-3 p-3 md:px-5 flex-row cursor-pointer hover:bg-accent/50 transition-colors",
      )}
      onClick={() => navigate(`/server/${serverInfo.id}`)}
    >
      <section
        className={cn("grid items-center gap-2 lg:w-40")}
        style={{ gridTemplateColumns: "auto auto 1fr" }}
      >
        <span className="h-2 w-2 shrink-0 rounded-full bg-red-500 self-center"></span>
        <div
          className={cn(
            "flex items-center justify-center",
            showFlag ? "min-w-[17px]" : "min-w-0",
          )}
        >
          {showFlag ? <ServerFlag country_code={country_code} /> : null}
        </div>
        <div className="relative">
          <p
            className={cn(
              "break-all font-bold w-28 tracking-tight",
              showFlag ? "text-xs" : "text-sm",
            )}
          >
            {name}
          </p>
        </div>
      </section>
    </Card>
  );
}
