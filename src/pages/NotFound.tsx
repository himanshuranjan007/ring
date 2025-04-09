
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import NetworkGraph from "@/components/NetworkGraph";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center relative">
        <NetworkGraph className="absolute inset-0 z-0" nodeCount={30} lineCount={20} />
        <div className="text-center relative z-10">
          <div className="font-mono mono-numbers">
            <h1 className="text-9xl font-light">404</h1>
            <div className="text-xs text-web3-green mb-6">ERROR</div>
          </div>
          <p className="text-2xl mb-8">Path not found</p>
          <Button
            asChild
            variant="outline"
            className="border border-web3-border bg-transparent hover:bg-white/5 transition-colors"
          >
            <Link to="/">
              <ArrowLeft className="mr-2 h-5 w-5" /> Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}

export default NotFound;
