
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import * as Icons from 'lucide-react';
import { useStore } from '@/store/useStore';

export function WifiDialog() {
  const { wifiDialogOpen, setWifiDialogOpen } = useStore();
  const [networkInfo, setNetworkInfo] = useState({ isp: 'Loading...', ip: 'Loading...' });

  useEffect(() => {
    if (wifiDialogOpen) {
      // Get network information
      fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => {
          setNetworkInfo({
            isp: navigator.connection ? 'WiFi Network' : 'Network',
            ip: data.ip
          });
        })
        .catch(() => {
          setNetworkInfo({
            isp: 'WiFi Network',
            ip: 'Not available'
          });
        });
    }
  }, [wifiDialogOpen]);

  return (
    <Dialog open={wifiDialogOpen} onOpenChange={setWifiDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icons.Wifi className="h-5 w-5" />
            Network Information
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
            <Icons.Wifi className="h-8 w-8 text-primary" />
            <div className="flex-1">
              <p className="font-semibold">{networkInfo.isp}</p>
              <p className="text-sm text-muted-foreground">Connected</p>
            </div>
            <Icons.Check className="h-5 w-5 text-green-500" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">IP Address:</span>
              <span className="text-sm font-mono">{networkInfo.ip}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Status:</span>
              <span className="text-sm text-green-600">Active</span>
            </div>
          </div>

          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => setWifiDialogOpen(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
