import asyncio
from app.services.groq_service import client

async def main():
    try:
        await client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[{"role": "user", "content": "hello"}],
            temperature=1,
            max_completion_tokens=8192,
            top_p=1,
            reasoning_effort="medium",
        )
    except Exception as e:
        print("ERROR:", repr(e))

asyncio.run(main())
