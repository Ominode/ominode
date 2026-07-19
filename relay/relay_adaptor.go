package relay

import (
	"strconv"

	"github.com/chain-works/ominode/constant"
	"github.com/chain-works/ominode/relay/channel"
	"github.com/chain-works/ominode/relay/channel/advancedcustom"
	"github.com/chain-works/ominode/relay/channel/ali"
	"github.com/chain-works/ominode/relay/channel/aws"
	"github.com/chain-works/ominode/relay/channel/baidu"
	"github.com/chain-works/ominode/relay/channel/baidu_v2"
	"github.com/chain-works/ominode/relay/channel/claude"
	"github.com/chain-works/ominode/relay/channel/cloudflare"
	"github.com/chain-works/ominode/relay/channel/codex"
	"github.com/chain-works/ominode/relay/channel/cohere"
	"github.com/chain-works/ominode/relay/channel/coze"
	"github.com/chain-works/ominode/relay/channel/deepseek"
	"github.com/chain-works/ominode/relay/channel/dify"
	"github.com/chain-works/ominode/relay/channel/gemini"
	"github.com/chain-works/ominode/relay/channel/jimeng"
	"github.com/chain-works/ominode/relay/channel/jina"
	"github.com/chain-works/ominode/relay/channel/minimax"
	"github.com/chain-works/ominode/relay/channel/mistral"
	"github.com/chain-works/ominode/relay/channel/mokaai"
	"github.com/chain-works/ominode/relay/channel/moonshot"
	"github.com/chain-works/ominode/relay/channel/ollama"
	"github.com/chain-works/ominode/relay/channel/openai"
	"github.com/chain-works/ominode/relay/channel/palm"
	"github.com/chain-works/ominode/relay/channel/perplexity"
	"github.com/chain-works/ominode/relay/channel/replicate"
	"github.com/chain-works/ominode/relay/channel/siliconflow"
	"github.com/chain-works/ominode/relay/channel/submodel"
	taskali "github.com/chain-works/ominode/relay/channel/task/ali"
	taskdoubao "github.com/chain-works/ominode/relay/channel/task/doubao"
	taskGemini "github.com/chain-works/ominode/relay/channel/task/gemini"
	"github.com/chain-works/ominode/relay/channel/task/hailuo"
	taskjimeng "github.com/chain-works/ominode/relay/channel/task/jimeng"
	"github.com/chain-works/ominode/relay/channel/task/kling"
	tasksora "github.com/chain-works/ominode/relay/channel/task/sora"
	"github.com/chain-works/ominode/relay/channel/task/suno"
	taskvertex "github.com/chain-works/ominode/relay/channel/task/vertex"
	taskVidu "github.com/chain-works/ominode/relay/channel/task/vidu"
	"github.com/chain-works/ominode/relay/channel/tencent"
	"github.com/chain-works/ominode/relay/channel/vertex"
	"github.com/chain-works/ominode/relay/channel/volcengine"
	"github.com/chain-works/ominode/relay/channel/xai"
	"github.com/chain-works/ominode/relay/channel/xunfei"
	"github.com/chain-works/ominode/relay/channel/zhipu"
	"github.com/chain-works/ominode/relay/channel/zhipu_4v"
	"github.com/gin-gonic/gin"
)

func GetAdaptor(apiType int) channel.Adaptor {
	switch apiType {
	case constant.APITypeAli:
		return &ali.Adaptor{}
	case constant.APITypeAnthropic:
		return &claude.Adaptor{}
	case constant.APITypeBaidu:
		return &baidu.Adaptor{}
	case constant.APITypeGemini:
		return &gemini.Adaptor{}
	case constant.APITypeOpenAI:
		return &openai.Adaptor{}
	case constant.APITypePaLM:
		return &palm.Adaptor{}
	case constant.APITypeTencent:
		return &tencent.Adaptor{}
	case constant.APITypeXunfei:
		return &xunfei.Adaptor{}
	case constant.APITypeZhipu:
		return &zhipu.Adaptor{}
	case constant.APITypeZhipuV4:
		return &zhipu_4v.Adaptor{}
	case constant.APITypeOllama:
		return &ollama.Adaptor{}
	case constant.APITypePerplexity:
		return &perplexity.Adaptor{}
	case constant.APITypeAws:
		return &aws.Adaptor{}
	case constant.APITypeCohere:
		return &cohere.Adaptor{}
	case constant.APITypeDify:
		return &dify.Adaptor{}
	case constant.APITypeJina:
		return &jina.Adaptor{}
	case constant.APITypeCloudflare:
		return &cloudflare.Adaptor{}
	case constant.APITypeSiliconFlow:
		return &siliconflow.Adaptor{}
	case constant.APITypeVertexAi:
		return &vertex.Adaptor{}
	case constant.APITypeMistral:
		return &mistral.Adaptor{}
	case constant.APITypeDeepSeek:
		return &deepseek.Adaptor{}
	case constant.APITypeMokaAI:
		return &mokaai.Adaptor{}
	case constant.APITypeVolcEngine:
		return &volcengine.Adaptor{}
	case constant.APITypeBaiduV2:
		return &baidu_v2.Adaptor{}
	case constant.APITypeOpenRouter:
		return &openai.Adaptor{}
	case constant.APITypeXinference:
		return &openai.Adaptor{}
	case constant.APITypeXai:
		return &xai.Adaptor{}
	case constant.APITypeCoze:
		return &coze.Adaptor{}
	case constant.APITypeJimeng:
		return &jimeng.Adaptor{}
	case constant.APITypeMoonshot:
		return &moonshot.Adaptor{} // Moonshot uses Claude API
	case constant.APITypeSubmodel:
		return &submodel.Adaptor{}
	case constant.APITypeMiniMax:
		return &minimax.Adaptor{}
	case constant.APITypeReplicate:
		return &replicate.Adaptor{}
	case constant.APITypeCodex:
		return &codex.Adaptor{}
	case constant.APITypeAdvancedCustom:
		return &advancedcustom.Adaptor{}
	}
	return nil
}

func GetTaskPlatform(c *gin.Context) constant.TaskPlatform {
	channelType := c.GetInt("channel_type")
	if channelType > 0 {
		return constant.TaskPlatform(strconv.Itoa(channelType))
	}
	return constant.TaskPlatform(c.GetString("platform"))
}

func GetTaskAdaptor(platform constant.TaskPlatform) channel.TaskAdaptor {
	switch platform {
	//case constant.APITypeAIProxyLibrary:
	//	return &aiproxy.Adaptor{}
	case constant.TaskPlatformSuno:
		return &suno.TaskAdaptor{}
	}
	if channelType, err := strconv.ParseInt(string(platform), 10, 64); err == nil {
		switch channelType {
		case constant.ChannelTypeAli:
			return &taskali.TaskAdaptor{}
		case constant.ChannelTypeKling:
			return &kling.TaskAdaptor{}
		case constant.ChannelTypeJimeng:
			return &taskjimeng.TaskAdaptor{}
		case constant.ChannelTypeVertexAi:
			return &taskvertex.TaskAdaptor{}
		case constant.ChannelTypeVidu:
			return &taskVidu.TaskAdaptor{}
		case constant.ChannelTypeDoubaoVideo, constant.ChannelTypeVolcEngine:
			return &taskdoubao.TaskAdaptor{}
		case constant.ChannelTypeSora, constant.ChannelTypeOpenAI:
			return &tasksora.TaskAdaptor{}
		case constant.ChannelTypeGemini:
			return &taskGemini.TaskAdaptor{}
		case constant.ChannelTypeMiniMax:
			return &hailuo.TaskAdaptor{}
		}
	}
	return nil
}
