import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import * as Icons from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useOpenLink } from '@/lib/browserUtils';

interface Email {
  id: string;
  from: string;
  subject: string;
  body: string;
  date: Date;
  read: boolean;
}

const mockEmails: Email[] = [
  {
    id: '1',
    from: 'team@replit.com',
    subject: 'Welcome to WebOS',
    body: 'Thank you for trying out our web-based operating system!',
    date: new Date(2025, 9, 15),
    read: false,
  },
  {
    id: '2',
    from: 'updates@webos.dev',
    subject: 'New Features Available',
    body: 'Check out the latest updates including improved window management and new apps. Visit https://webos.dev for more info.',
    date: new Date(2025, 9, 14),
    read: true,
  },
];

export function EmailClient() {
  const [emails] = useState<Email[]>(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);
  const openLink = useOpenLink();

  const currentEmail = emails.find((e) => e.id === selectedEmail);

  return (
    <div className="flex h-full">
      {/* Email List */}
      <div className="w-80 border-r border-border/50 flex flex-col">
        <div className="p-3 border-b border-border/50 flex items-center justify-between">
          <h3 className="font-semibold">Inbox</h3>
          <Button size="sm" onClick={() => setComposing(true)} data-testid="button-compose">
            <Icons.Plus className="h-4 w-4 mr-1" />
            Compose
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          {emails.map((email) => (
            <button
              key={email.id}
              onClick={() => setSelectedEmail(email.id)}
              className={cn(
                "w-full text-left p-3 border-b border-border/50 hover-elevate active-elevate-2",
                selectedEmail === email.id && "bg-primary/20",
                !email.read && "font-semibold"
              )}
              data-testid={`email-${email.id}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm truncate flex-1">{email.from}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {email.date.toLocaleDateString()}
                </span>
              </div>
              <div className="text-sm truncate">{email.subject}</div>
              <div className="text-xs text-muted-foreground truncate mt-1">{email.body}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 flex flex-col">
        {composing ? (
          <div className="flex-1 flex flex-col p-4 gap-4">
            <Input placeholder="To" data-testid="input-to" />
            <Input placeholder="Subject" data-testid="input-subject" />
            <Textarea
              placeholder="Message"
              className="flex-1 resize-none"
              data-testid="textarea-message"
            />
            <div className="flex gap-2">
              <Button data-testid="button-send">
                <Icons.Send className="h-4 w-4 mr-2" />
                Send
              </Button>
              <Button variant="outline" onClick={() => setComposing(false)} data-testid="button-cancel">
                Cancel
              </Button>
            </div>
          </div>
        ) : currentEmail ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-border/50">
              <h2 className="text-xl font-semibold mb-2">{currentEmail.subject}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icons.User className="h-4 w-4" />
                <span>{currentEmail.from}</span>
                <span>•</span>
                <span>{currentEmail.date.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-auto">
                <p
                  className="text-sm whitespace-pre-wrap"
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.tagName === 'A') {
                      e.preventDefault();
                      const href = (target as HTMLAnchorElement).href;
                      if (href) openLink(href);
                    }
                  }}
                  dangerouslySetInnerHTML={{
                    __html: currentEmail.body.replace(
                      /(https?:\/\/[^\s]+)/g,
                      '<a href="$1" style="color: #3b82f6; text-decoration: underline; cursor: pointer;">$1</a>'
                    )
                  }}
                />
              </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Icons.Mail className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Select an email to read</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}