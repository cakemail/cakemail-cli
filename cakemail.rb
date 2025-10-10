class CakemailCli < Formula
  desc "Official command-line interface for the Cakemail API"
  homepage "https://github.com/cakemail/cakemail-cli"
  url "https://registry.npmjs.org/@cakemail-org/cakemail-cli/-/cakemail-cli-1.2.0.tgz"
  sha256 "c8d3eae160a892e32837db3dcae515e843e5383fef52b8141940c8bcf8b6d59f"
  license "MIT"

  depends_on "node"

  def install
    system "npm", "install", *std_npm_args
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    # Test that binary exists and is executable
    assert_predicate bin/"cakemail", :exist?
    assert_predicate bin/"cakemail", :executable?
  end
end
