package controller

import (
	"strings"

	"github.com/chain-works/ominode/common"
	"github.com/chain-works/ominode/setting/system_setting"
)

func paymentReturnPath(suffix string) string {
	base := strings.TrimRight(system_setting.ServerAddress, "/")
	return base + common.ThemeAwarePath(suffix)
}
