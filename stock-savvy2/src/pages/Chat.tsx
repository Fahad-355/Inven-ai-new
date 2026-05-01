import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProducts, getLowStockProducts, getTotalValue } from "@/lib/data";

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
}

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  const products = getProducts();
  const lowStock = getLowStockProducts();

  if (lower.includes("low stock"))
    return lowStock.length === 0
      ? "All products are well-stocked!"
      : `There are ${lowStock.length} low stock items: ${lowStock.map((p) => `${p.name} (${p.quantity})`).join(", ")}.`;

  if (lower.includes("total product") || lower.includes("how many product"))
    return `You have ${products.length} products in your inventory.`;

  if (lower.includes("value") || lower.includes("worth"))
    return `Your total inventory value is $${getTotalValue().toLocaleString("en-US", { minimumFractionDigits: 2 })}.`;

  if (lower.includes("hello") || lower.includes("hi"))
    return "Hello! I can help you with inventory questions. Try asking about low stock items, total products, or inventory value.";

  return "I can help with: low stock items, total products, and inventory value. Try asking one of those!";
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "ai", text: "Hi! I'm your AI inventory assistant. Ask me about your stock levels, product count, or inventory value." },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", text: input.trim() };
    const aiMsg: Message = { id: Date.now() + 1, role: "ai", text: getAIResponse(input) };
    setMessages((m) => [...m, userMsg, aiMsg]);
    setInput("");
  };

  const quickActions = ["Show low stock items", "Total products", "Inventory value"];

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-5rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">AI Assistant</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Ask questions about your inventory</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto bg-card rounded-xl shadow-card border border-border/50 p-4 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""} animate-fade-in`}>
            {m.role === "ai" && (
              <div className="h-7 w-7 rounded-lg gradient-primary flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
            )}
            <div className={`max-w-[75%] rounded-xl px-3.5 py-2.5 text-sm ${
              m.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-card-foreground"
            }`}>
              {m.text}
            </div>
            {m.role === "user" && (
              <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {quickActions.map((q) => (
          <Button key={q} variant="outline" size="sm" className="text-xs" onClick={() => { setInput(q); }}>
            {q}
          </Button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about your inventory…"
          className="flex-1"
        />
        <Button onClick={send} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
