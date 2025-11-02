'use client'

import { Ruler } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function SizeGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="px-0">
          <Ruler className="mr-2 h-4 w-4" />
          Size Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Size Guide</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="clothing">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="clothing">Clothing</TabsTrigger>
            <TabsTrigger value="shoes">Shoes</TabsTrigger>
            <TabsTrigger value="accessories">Accessories</TabsTrigger>
          </TabsList>

          <TabsContent value="clothing" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Men's Clothing</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Size</th>
                      <th className="text-left py-2">Chest (inches)</th>
                      <th className="text-left py-2">Waist (inches)</th>
                      <th className="text-left py-2">Hip (inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">XS</td>
                      <td className="py-2">32-34</td>
                      <td className="py-2">26-28</td>
                      <td className="py-2">33-35</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">S</td>
                      <td className="py-2">34-36</td>
                      <td className="py-2">28-30</td>
                      <td className="py-2">35-37</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">M</td>
                      <td className="py-2">38-40</td>
                      <td className="py-2">32-34</td>
                      <td className="py-2">39-41</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">L</td>
                      <td className="py-2">42-44</td>
                      <td className="py-2">36-38</td>
                      <td className="py-2">43-45</td>
                    </tr>
                    <tr>
                      <td className="py-2">XL</td>
                      <td className="py-2">46-48</td>
                      <td className="py-2">40-42</td>
                      <td className="py-2">47-49</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Women's Clothing</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Size</th>
                      <th className="text-left py-2">Bust (inches)</th>
                      <th className="text-left py-2">Waist (inches)</th>
                      <th className="text-left py-2">Hip (inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">XS</td>
                      <td className="py-2">30-32</td>
                      <td className="py-2">23-25</td>
                      <td className="py-2">33-35</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">S</td>
                      <td className="py-2">32-34</td>
                      <td className="py-2">25-27</td>
                      <td className="py-2">35-37</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">M</td>
                      <td className="py-2">34-36</td>
                      <td className="py-2">27-29</td>
                      <td className="py-2">37-39</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">L</td>
                      <td className="py-2">36-38</td>
                      <td className="py-2">29-31</td>
                      <td className="py-2">39-41</td>
                    </tr>
                    <tr>
                      <td className="py-2">XL</td>
                      <td className="py-2">38-40</td>
                      <td className="py-2">31-33</td>
                      <td className="py-2">41-43</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">How to Measure</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• <strong>Chest/Bust:</strong> Measure around the fullest part</li>
                <li>• <strong>Waist:</strong> Measure around the natural waistline</li>
                <li>• <strong>Hip:</strong> Measure around the fullest part</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="shoes" className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">US Size</th>
                    <th className="text-left py-2">UK Size</th>
                    <th className="text-left py-2">EU Size</th>
                    <th className="text-left py-2">Length (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { us: '6', uk: '5', eu: '38', cm: '23.5' },
                    { us: '7', uk: '6', eu: '39', cm: '24.1' },
                    { us: '8', uk: '7', eu: '40', cm: '24.8' },
                    { us: '9', uk: '8', eu: '41', cm: '25.4' },
                    { us: '10', uk: '9', eu: '42', cm: '26.0' },
                    { us: '11', uk: '10', eu: '43', cm: '26.7' },
                  ].map((size, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{size.us}</td>
                      <td className="py-2">{size.uk}</td>
                      <td className="py-2">{size.eu}</td>
                      <td className="py-2">{size.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="accessories" className="space-y-4">
            <p className="text-muted-foreground">
              Size information varies by accessory type. Please refer to the specific product details for measurements.
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
