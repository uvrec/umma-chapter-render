/**
 * NotificationSettings - Налаштування сповіщень календаря
 *
 * Дозволяє користувачу налаштувати:
 * - Сповіщення про екадаші
 * - Сповіщення про свята
 * - Час надсилання сповіщень
 * - Сповіщення за день до події
 */

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCalendarSettings } from "@/hooks/useCalendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, BellRing, Clock, Moon, Star, Mail, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface NotificationSettingsProps {
  trigger?: React.ReactNode;
}

export function NotificationSettings({ trigger }: NotificationSettingsProps) {
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const { settings, updateSettings, isSaving } = useCalendarSettings();

  const [open, setOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState({
    notify_ekadashi: settings?.notify_ekadashi ?? false,
    notify_festivals: settings?.notify_festivals ?? false,
    notify_day_before: settings?.notify_day_before ?? true,
    notification_time: settings?.notification_time ?? "06:00",
  });

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast({
        title: language === "uk" ? "Потрібна авторизація" : "Authentication required",
        description:
          language === "uk"
            ? "Увійдіть, щоб зберегти налаштування сповіщень"
            : "Please log in to save notification settings",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateSettings(localSettings);
      toast({
        title: language === "uk" ? "Збережено" : "Saved",
        description:
          language === "uk"
            ? "Налаштування сповіщень оновлено"
            : "Notification settings updated",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: language === "uk" ? "Помилка" : "Error",
        description:
          language === "uk"
            ? "Не вдалося зберегти налаштування"
            : "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  const timeOptions = [
    { value: "05:00", label: "05:00" },
    { value: "06:00", label: "06:00" },
    { value: "07:00", label: "07:00" },
    { value: "08:00", label: "08:00" },
    { value: "09:00", label: "09:00" },
    { value: "18:00", label: "18:00" },
    { value: "19:00", label: "19:00" },
    { value: "20:00", label: "20:00" },
  ];

  const content = (
    <div className="space-y-6">
      {!isAuthenticated && (
        <Card className="border-amber-500/50 bg-amber-500/10">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <LogIn className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">
                  {language === "uk"
                    ? "Увійдіть для отримання сповіщень"
                    : "Log in to receive notifications"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === "uk"
                    ? "Сповіщення надсилаються на електронну пошту"
                    : "Notifications are sent to your email"}
                </p>
                <Link to="/auth">
                  <Button size="sm" variant="outline" className="mt-2">
                    {language === "uk" ? "Увійти" : "Log in"}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon className="h-5 w-5 text-blue-500" />
            <div>
              <Label htmlFor="notify-ekadashi" className="font-medium">
                {language === "uk" ? "Екадаші" : "Ekadashi"}
              </Label>
              <p className="text-xs text-muted-foreground">
                {language === "uk"
                  ? "Нагадування про день посту"
                  : "Fasting day reminders"}
              </p>
            </div>
          </div>
          <Switch
            id="notify-ekadashi"
            checked={localSettings.notify_ekadashi}
            onCheckedChange={(checked) =>
              setLocalSettings({ ...localSettings, notify_ekadashi: checked })
            }
            disabled={!isAuthenticated}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-yellow-500" />
            <div>
              <Label htmlFor="notify-festivals" className="font-medium">
                {language === "uk" ? "Свята та явлення" : "Festivals & Appearances"}
              </Label>
              <p className="text-xs text-muted-foreground">
                {language === "uk"
                  ? "Вайшнавські свята і дні явлення"
                  : "Vaishnava festivals and appearance days"}
              </p>
            </div>
          </div>
          <Switch
            id="notify-festivals"
            checked={localSettings.notify_festivals}
            onCheckedChange={(checked) =>
              setLocalSettings({ ...localSettings, notify_festivals: checked })
            }
            disabled={!isAuthenticated}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BellRing className="h-5 w-5 text-orange-500" />
            <div>
              <Label htmlFor="notify-day-before" className="font-medium">
                {language === "uk" ? "За день до події" : "Day before event"}
              </Label>
              <p className="text-xs text-muted-foreground">
                {language === "uk"
                  ? "Сповіщення надійде напередодні"
                  : "Receive notification the day before"}
              </p>
            </div>
          </div>
          <Switch
            id="notify-day-before"
            checked={localSettings.notify_day_before}
            onCheckedChange={(checked) =>
              setLocalSettings({ ...localSettings, notify_day_before: checked })
            }
            disabled={!isAuthenticated}
          />
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor="notification-time" className="font-medium">
            {language === "uk" ? "Час сповіщення" : "Notification time"}
          </Label>
        </div>
        <Select
          value={localSettings.notification_time}
          onValueChange={(value) =>
            setLocalSettings({ ...localSettings, notification_time: value })
          }
          disabled={!isAuthenticated}
        >
          <SelectTrigger id="notification-time" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {language === "uk"
            ? "Сповіщення надійде у вибраний час за вашим часовим поясом"
            : "Notification will be sent at the selected time in your timezone"}
        </p>
      </div>

      <div className="flex items-start gap-3 pt-2 p-3 rounded-lg bg-muted/50">
        <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div>
          <p className="text-sm">
            {language === "uk"
              ? "Сповіщення надсилаються на електронну пошту"
              : "Notifications are sent via email"}
          </p>
          {user?.email && (
            <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
          )}
        </div>
      </div>
    </div>
  );

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <Bell className="h-4 w-4" />
      {language === "uk" ? "Сповіщення" : "Notifications"}
    </Button>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger || defaultTrigger}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {language === "uk" ? "Сповіщення календаря" : "Calendar Notifications"}
          </SheetTitle>
          <SheetDescription>
            {language === "uk"
              ? "Отримуйте нагадування про екадаші та свята"
              : "Receive reminders about Ekadashi and festivals"}
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">{content}</div>
        {isAuthenticated && (
          <SheetFooter>
            <Button onClick={handleSave} disabled={isSaving} className="w-full">
              {isSaving
                ? language === "uk"
                  ? "Збереження..."
                  : "Saving..."
                : language === "uk"
                ? "Зберегти"
                : "Save"}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
