FROM mcr.microsoft.com/playwright:v1.52.0-noble

WORKDIR /app

# Install bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

# Copy package files and install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Expose port
EXPOSE 3000

# Start server
CMD ["bun", "run", "src/index.ts"]
